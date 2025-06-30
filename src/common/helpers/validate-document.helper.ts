import { isValidCPF, isValidCNPJ } from '@brazilian-utils/brazilian-utils';

export const isValidDocument = (data: string): boolean => {
	if (data.length === 11) {
		return isValidCPF(data);
	}

	if (data.length === 14) {
		return isValidCNPJ(data);
	}

	return false;
};
