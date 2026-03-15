import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext/index.jsx";
import { RoleProvider } from "./context/RoleContext/index.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RoleProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</RoleProvider>
	</StrictMode>
);
