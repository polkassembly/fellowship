// Copyright 2019-2025 @polkassembly/fellowship authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import NotificationMessage from '@/components/Misc/NotificationMessage';
import { ToastOptions, toast } from 'react-toastify';

interface Props {
	header: string;
	message?: string;
	duration?: number;
	status?: 'error' | 'info' | 'success' | 'warn';
}

const queueNotification = ({ header, message, duration = 5000, status }: Props) => {
	const args: ToastOptions = {
		autoClose: duration
	};

	if (status) {
		// eslint-disable-next-line security/detect-object-injection
		toast[status](
			<NotificationMessage
				header={header}
				message={message}
			/>,
			args
		);
		return;
	}

	toast(
		<NotificationMessage
			header={header}
			message={message}
		/>,
		args
	);
};

export default queueNotification;
