import { DatabaseConnection, DatabaseConfig } from '../database/connection.js';

describe('DatabaseConnection', () => {
  let dbConnection: DatabaseConnection;
  const testConfig: DatabaseConfig = {
    server: 'localhost',
    database: 'master',
    user: 'sa',
    password: 'test',
    connectionTimeout: 10,
    commandTimeout: 10
  };

  beforeEach(() => {
    dbConnection = DatabaseConnection.getInstance(testConfig);
  });

  afterEach(async () => {
    if (dbConnection.isConnected()) {
      await dbConnection.disconnect();
    }
  });

  test('should create singleton instance', () => {
    const instance1 = DatabaseConnection.getInstance(testConfig);
    const instance2 = DatabaseConnection.getInstance(testConfig);
    expect(instance1).toBe(instance2);
  });

  test('should check connection status', () => {
    expect(dbConnection.isConnected()).toBe(false);
  });
}); 