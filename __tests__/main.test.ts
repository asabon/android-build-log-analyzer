import * as core from '@actions/core';
import * as fs from 'fs';
import { run } from '../src/analyzer';

jest.mock('@actions/core', () => ({
    getInput: jest.fn(),
    setFailed: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn()
}));

jest.mock('fs');

const mockedCore = core as jest.Mocked<typeof core>;
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('Log Analyzer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should fail if log file does not exist', async () => {
        (mockedCore.getInput as jest.Mock).mockReturnValue('dummy.log');
        (mockedFs.existsSync as jest.Mock).mockReturnValue(false);

        await run();

        expect(mockedCore.setFailed).toHaveBeenCalledWith(expect.stringContaining('Log file not found'));
    });

    test('should detect errors in log file', async () => {
        (mockedCore.getInput as jest.Mock).mockReturnValue('dummy.log');
        (mockedFs.existsSync as jest.Mock).mockReturnValue(true);
        (mockedFs.readFileSync as jest.Mock).mockReturnValue('Normal line\nError: Something bad happened\nAnother line');

        await run();

        expect(mockedCore.error).toHaveBeenCalledWith('Error: Something bad happened', expect.anything());
        expect(mockedCore.setFailed).toHaveBeenCalledWith(expect.stringContaining('Found 1 errors'));
    });

    test('should detect warnings in log file', async () => {
        (mockedCore.getInput as jest.Mock).mockReturnValue('dummy.log');
        (mockedFs.existsSync as jest.Mock).mockReturnValue(true);
        (mockedFs.readFileSync as jest.Mock).mockReturnValue('Normal line\nWarning: Be careful\nAnother line');

        await run();

        expect(mockedCore.warning).toHaveBeenCalledWith('Warning: Be careful', expect.anything());
        expect(mockedCore.setFailed).not.toHaveBeenCalled();
    });

    test('should NOT flag Gradle tasks with "Error" in name as actual errors', async () => {
        (mockedCore.getInput as jest.Mock).mockReturnValue('dummy.log');
        (mockedFs.existsSync as jest.Mock).mockReturnValue(true);
        (mockedFs.readFileSync as jest.Mock).mockReturnValue('> Task :app:checkKotlinGradlePluginConfigurationErrors SKIPPED');

        await run();

        expect(mockedCore.error).not.toHaveBeenCalled();
        expect(mockedCore.setFailed).not.toHaveBeenCalled();
    });
});
