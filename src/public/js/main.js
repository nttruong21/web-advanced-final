// ------------------------ ADMIN --------------------------------

//const { default: axios } = require("axios");

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
		if (!err.response.data.time) {
			alert("error", "Đăng nhập thất bại", `${err.response.data.message}!!!`);
		} else {
			Swal.fire({
				title: "Khóa tài khoản",
				icon: "error",
				html: `<strong>${err.response.data.message}</strong>`,
			});
			// hide button show message below button
			document.querySelector(".btn_login").style.display = "none";
			document.querySelector("#alert_message").style.display = "block";
			let time = 30;
			// setInterval time
			const interval = setInterval(() => {
				time--;
				document.querySelector("#time_count").innerHTML = `<strong>${time}</strong>`;
				if (time === 0) {
					clearInterval(interval);
					document.querySelector(".btn_login").style.display = "inline-block";
					document.querySelector("#alert_message").style.display = "none";
				}
			}, 1000);
		}
	}
};
if (form_login) {
	let data = sessionStorage.getItem("username");
	if (data) {
		document.querySelector("#username").value = data;
	}
	form_login.addEventListener("submit", e => {
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
	form_changePassword.addEventListener("submit", async e => {
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
			alert("error", "Đổi mật khẩu thất bại", `${err.response.data.message}!!!`);
		}
	});
}

// forgot password
const form_forgotPass = document.querySelector(".form_forgotPass");
if (form_forgotPass) {
	form_forgotPass.addEventListener("submit", async e => {
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
				alert("success", "Thành công", "Gửi email thành công.Vui long kiểm tra email");
			}
		} catch (err) {
			alert("error", "Gửi email thất bại", `${err.response.data.message}!!!`);
		}
	});
}
// ------------------------------------------------------------------------------

// reset password
const form_resetPass = document.querySelector(".form_resetPass");

if (form_resetPass) {
	form_resetPass.addEventListener("submit", async e => {
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
			alert("error", "Đổi mật khẩu thất bại", `${err.response.data.message}!!!`);
		}
	});
}

// Đăng ký
const form_signup = document.querySelector(".form_signup");
if (form_signup) {
	form_signup.addEventListener("submit", async e => {
		e.preventDefault();
		const phone = document.querySelector("#phone").value;
		const email = document.querySelector("#email").value;
		const name = document.querySelector("#name").value;
		const birthday = document.querySelector("#birthday").value;
		const address = document.querySelector("#address").value;
		// value file
		const frontIdCard = document.querySelector("#frontIdCard").files[0];
		const backIdCard = document.querySelector("#backIdCard").files[0];
		// if (!frontIdCard || !backIdCard) {
		// 	return alert(
		// 		"error",
		// 		"Lỗi",
		// 		"Hãy upload đầy đủ các chứng minh nhân dân trước và sau"
		// 	);
		// }
		// form data
		const formData = new FormData();
		formData.append("phone", phone);
		formData.append("email", email);
		formData.append("name", name);
		formData.append("birthday", birthday);
		formData.append("address", address);
		formData.append("frontIdCard", frontIdCard);
		formData.append("backIdCard", backIdCard);

		try {
			const res = await axios({
				method: "POST",
				url: "/api/accounts/signup",
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			if (res.data.status === "success") {
				alert("success", "Thành công", "Đăng ký thành công.Vui lòng kiểm tra email để lấy tài khoản và mật khẩu");
				window.setTimeout(() => {
					location.assign("/login");
				}, 1500);
			}
		} catch (err) {
			alert("error", "Đăng ký thất bại", `${err.response.data.errors}!!!`);
		}
	});
}

// Đăng xuất
const logout = document.querySelector("#logout");
if (logout) {
	logout.addEventListener("click", async e => {
		e.preventDefault();
		try {
			const res = await axios({
				method: "GET",
				url: "/api/accounts/logout",
			});
			if (res.data.status === "success") {
				location.assign("/login");
			}
		} catch (err) {
			console.log(err);
		}
	});
}

// ------------------------ End Authentication --------------------------------
// ------------------------ Transaction---------------------------------------
//------------------------- Deposit -------------------------------------------
const btnDeposit = document.getElementById("btn-deposit");
if (btnDeposit) {
	btnDeposit.addEventListener("click", async e => {
		e.preventDefault();
		const cardNumber = document.getElementById("cardNumber").value;
		const cardExpirationDate = document.getElementById("cardExpirationDate").value;
		const cvv = document.getElementById("cvv").value;
		const price = document.getElementById("price").value;

		axios
			.post("/transactions/deposit", {
				cardNumber,
				cardExpirationDate,
				cvv,
				price,
			})
			.catch(err => {
				alert("error", "Thất bại", `${err.response.data.message}!!!`);
			});
	});
}

//------------------------- End Deposit ---------------------------------------

//------------------------- Withdraw ------------------------------------------

//------------------------- End Withdraw --------------------------------------

//------------------------- Transfer ------------------------------------------

//------------------------- End Transfer --------------------------------------
//------------------------- End Transaction -----------------------------------

/* Data-table */
$(document).ready(function () {
	$(".data-table").each(function (_, table) {
		$(table).DataTable();
	});
});
