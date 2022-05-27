// ------------------------ ADMIN --------------------------------

// ------------------------ CLIENT -------------------------------

// ------------------------ Authentication -------------------------------
const alert = (icon, title, message) => {
	Swal.fire({
		icon,
		title,
		text: message,
	});
};

// login
const form_login = document.querySelector(".form-login");
const login = async (username, password) => {
	try {
		const res = await axios({
			method: "POST",
			url: "/api/accounts/login",
			data: {
				username,
				password,
			},
		});
		if (res.data.code === 0) {
			Swal.fire({
				icon: "success",
				title: "Đăng nhập thành công",
				showConfirmButton: false,
			});
			window.setTimeout(() => {
				location.assign("/changePasswordFirst");
			}, 1500);
		} else if (res.data.status === "success") {
			Swal.fire({
				icon: "success",
				title: "Đăng nhập thành công",
				showConfirmButton: false,
			});
			window.setTimeout(() => {
				location.assign("/accounts");
			}, 1500);
		}
	} catch (err) {
		alert("error", "Đăng nhập thất bại", `${err.response.data.message}!!!`);
	}
};
if (form_login) {
	let data = sessionStorage.getItem("username");
	if (data) {
		document.querySelector("#username").value = data;
	}
	form_login.addEventListener("submit", (e) => {
		e.preventDefault();
		const username = document.querySelector("#username").value;
		// set sessionStorage for username
		sessionStorage.setItem("username", username);

		const password = document.querySelector("#password").value;
		login(username, password);
	});
}

// change password
const form_changePassword = document.querySelector(".form_changePassword");
if (form_changePassword) {
	form_changePassword.addEventListener("submit", async (e) => {
		e.preventDefault();
		const newPassword = document.querySelector("#newPassword").value;
		const confirmPassword = document.querySelector("#password_confirm").value;
		console.log(newPassword, confirmPassword);
		if (newPassword !== confirmPassword) {
			alert("error", "Lỗi", "Mật khẩu không khớp");
			return;
		}
		try {
			const res = await axios({
				method: "Patch",
				url: "/api/accounts/changePassword",
				data: {
					newPassword,
				},
			});
			if (res.data.status === "success") {
				alert("success", "Thành công", "Đổi mật khẩu thành công");
				window.setTimeout(() => {
					location.assign("/accounts");
				}, 1500);
			}
		} catch (err) {
			alert(
				"error",
				"Đổi mật khẩu thất bại",
				`${err.response.data.message}!!!`
			);
		}
	});
}

// forgot password
const form_forgotPass = document.querySelector(".form_forgotPass");
if (form_forgotPass) {
	form_forgotPass.addEventListener("submit", async (e) => {
		e.preventDefault();
		const email = document.querySelector("#email").value;
		try {
			const res = await axios({
				method: "POST",
				url: "/api/accounts/forgotPassword",
				data: {
					email,
				},
			});
			if (res.data.status === "success") {
				alert(
					"success",
					"Thành công",
					"Gửi email thành công.Vui long kiểm tra email"
				);
			}
		} catch (err) {
			alert(
				"error",
				"Gửi email thất bại",
				`${err.response.data.message}!!!`
			);
		}
	});
}
// ------------------------------------------------------------------------------

// reset password
const form_resetPass = document.querySelector(".form_resetPass");

if (form_resetPass) {
	form_resetPass.addEventListener("submit", async (e) => {
		e.preventDefault();
		const password = document.querySelector("#password").value;
		const confirmPassword = document.querySelector("#password_confirm").value;
		if (password !== confirmPassword) {
			alert("error", "Lỗi", "Mật khẩu không khớp");
			return;
		}
		// Lay token tu url
		const token = window.location.pathname.split("/").pop();

		try {
			const res = await axios({
				method: "Patch",
				url: `/api/accounts/resetPassword/${token}`,
				data: {
					password,
				},
			});
			if (res.data.status === "success") {
				alert("success", "Thành công", "Đổi mật khẩu thành công");
				window.setTimeout(() => {
					location.assign("/login");
				}, 1500);
			}
		} catch (err) {
			alert(
				"error",
				"Đổi mật khẩu thất bại",
				`${err.response.data.message}!!!`
			);
		}
	});
}

// ------------------------ End Authentication --------------------------------
/* Data-table */
$(document).ready(function () {
	$(".data-table").each(function (_, table) {
		$(table).DataTable();
	});
});
