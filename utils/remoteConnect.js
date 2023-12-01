const stream = require('stream');
require('dotenv').config();
const fs = require('fs');
const { google } = require('googleapis');

const clientId = process.env.REMOTE_ID || '';
const clientSecret = process.env.REMOTE_SECRET || '';
const redirectUri = process.env.REMOTE_URI || '';
const refreshToken = process.env.REMOTE_TOKEN || '';
const resource = { "role": "reader", "type": "anyone" };

let driveClient;
const folderName = 'Jet-Social';
let folder;

const createDriveClient = async (clientId, clientSecret, redirectUri, refreshToken) => {
	const client = await new google.auth.OAuth2(clientId, clientSecret, redirectUri);

	client.setCredentials({ refresh_token: refreshToken });

	driveClient = await google.drive({
		version: 'v3',
		auth: client,
	});
};

const createFolder = async (folderName) => {
	return await driveClient.files.create({
		resource: {
			name: folderName,
			mimeType: 'application/vnd.google-apps.folder',
		},
		fields: 'id, name',
	});
};

const searchFolder = async (folderName) => {
	return new Promise((resolve, reject) => {
		driveClient.files.list(
			{
				q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
				fields: 'files(id, name)',
			},
			(err, res) => {
				if (err) {
					return reject(err);
				}

				return resolve(res.data.files ? res.data.files[0] : null);
			},
		);
	});
};

// single file upload
const saveFile = async (aFile) => {
	const bufferStream = new stream.PassThrough();
	bufferStream.end(aFile.buffer);
	const { data } = await driveClient.files.create({
		requestBody: {
			name: aFile.originalname,
			mimeType: aFile.mimeType,
			parents: folder.id ? [folder.id] : [],
		},
		media: {
			mimeType: aFile.mimeType,
			body: bufferStream,
		},
	});

	await driveClient.permissions.create({ fileId: data.id, resource: resource });

	return { filename: data.name, file_id: data.id };
};

// batch upload
const saveFiles = async (files) => {
	let results = [];
	for (let i = 0; i < files.length; i++) {
		let sendfile = await saveFile(files[i]);
		results.push(sendfile);
	}

	if (results.length === 1) {
		return results[0];
	}

	return results;
};

const deleteFile = async (fieldValue) => {
	try {
		const fileId = fieldValue.split('id=')[1];
		const result = await driveClient.files.delete({
			'fileId': fileId
		});

		if (result.status === 204) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return false;
	}
};

(async () => {
	await createDriveClient(clientId, clientSecret, redirectUri, refreshToken);

	folder = await searchFolder(folderName).catch((error) => {
		console.error(error);
		return null;
	});

	if (!folder) {
		folder = await createFolder(folderName);
	}
})();

module.exports = {
	saveFiles,
	deleteFile
};