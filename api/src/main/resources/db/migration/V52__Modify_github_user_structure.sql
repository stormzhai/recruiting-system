ALTER TABLE githubUser RENAME TO thirdParty;
ALTER TABLE thirdParty CHANGE COLUMN githubId thirdPartyId INT;