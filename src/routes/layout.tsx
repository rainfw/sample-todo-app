import type { LayoutHandler, RainElement } from "@rainfw/core";

const RootLayout: LayoutHandler = (_ctx, children: RainElement) => {
	return (
		<html lang="ja">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>TODO App - Rain.js</title>
				<link rel="stylesheet" href="/css/global.css" />
			</head>
			<body>
				<div className="container">{children}</div>
			</body>
		</html>
	);
};

export default RootLayout;
