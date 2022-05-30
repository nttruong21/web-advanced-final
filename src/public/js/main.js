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
			if (res.data.data.user.role === 1) {
				window.setTimeout(() => {
					location.assign("/admin/accounts");
				}, 1500);
			} else {
				window.setTimeout(() => {
					location.assign("/accounts");
				}, 1500);
			}
		}
	} catch (err) {
		if (!err.response.data.time) {
			alert(
				"error",
				"Đăng nhập thất bại",
				`${err.response.data.message}!!!`
			);
		} else {
			Swal.fire({
				title: "Khóa tài khoản",
				icon: "error",
				html: `<strong>${err.response.data.message}</strong>`,
			});
			// hide button show message below button
			document.querySelector(".btn_login").style.display = "none";
			document.querySelector("#alert_message").style.display = "block";
			let time = 60;
			// setInterval time
			const interval = setInterval(() => {
				time--;
				document.querySelector(
					"#time_count"
				).innerHTML = `<strong>${time}</strong>`;
				if (time === 0) {
					clearInterval(interval);
					document.querySelector(".btn_login").style.display =
						"inline-block";
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

// Đăng ký
const form_signup = document.querySelector(".form_signup");
if (form_signup) {
	form_signup.addEventListener("submit", async (e) => {
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
				alert(
					"success",
					"Thành công",
					"Đăng ký thành công.Vui lòng kiểm tra email để lấy tài khoản và mật khẩu"
				);
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
	logout.addEventListener("click", async (e) => {
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

// Thay đổi chứng minh nhân dân
const btn_js_changeIdCard = document.querySelector(".btn_js_changeIdCard");
if (btn_js_changeIdCard) {
	btn_js_changeIdCard.addEventListener("click", async (e) => {
		e.preventDefault();
		const frontIdCard = document.querySelector("#cmndmt").files[0];
		const backIdCard = document.querySelector("#cmndms").files[0];
		console.log(frontIdCard, backIdCard);
		const formData = new FormData();
		formData.append("frontIdCard", frontIdCard);
		formData.append("backIdCard", backIdCard);
		try {
			const res = await axios({
				method: "PATCH",
				url: "/api/accounts/changeIdCard",
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			if (res.data.status === "success") {
				alert(
					"success",
					"Thành công",
					"Thay đổi chứng minh nhân dân thành công"
				);
				// set img src to img
				document.querySelector("#cmndmt").src = res.data.data.frontIdCard;
				document.querySelector("#cmndms").src = res.data.data.backIdCard;
				document.querySelector("#alert_cmnd").style.display = "none";
			}
		} catch (err) {
			console.log(err);
		}
	});
}

const btn_changePasswordMe = document.querySelector(".btn_changePasswordMe");
if (btn_changePasswordMe) {
	btn_changePasswordMe.addEventListener("click", async (e) => {
		e.preventDefault();
		const password = document.querySelector("#old_password").value;
		const newPassword = document.querySelector("#newPassword").value;
		const newPassword_confirm = document.querySelector(
			"#newPassword_confirm"
		).value;
		if (!password || !newPassword || !newPassword_confirm) {
			return alert("error", "Lỗi", "Hãy nhập đầy đủ thông tin mật khẩu");
		}
		if (newPassword !== newPassword_confirm) {
			return alert("error", "Lỗi", "Mật khẩu mới không khớp");
		}
		try {
			const res = await axios({
				method: "PATCH",
				url: "/api/accounts/changePasswordMe",
				data: {
					password,
					newPassword,
				},
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (res.data.status === "success") {
				alert("success", "Thành công", "Thay đổi mật khẩu thành công");
				document.querySelector("#old_password").value = "";
				document.querySelector("#newPassword").value = "";
				document.querySelector("#newPassword_confirm").value = "";
			}
		} catch (err) {
			return alert("error", "Lỗi", `${err.response.data.message}!!!`);
		}
	});
}

// ------------------------ End Authentication -------------------------------------
// Các hàm sử dụng ------------------------------------------------------------------
const loadFile = function (event) {
	const output = document.getElementById("output");
	output.src = URL.createObjectURL(event.target.files[0]);
	output.onload = function () {
		URL.revokeObjectURL(output.src); // free memory
	};
};
const loadFile1 = function (event) {
	const output1 = document.getElementById("output1");
	output1.src = URL.createObjectURL(event.target.files[0]);
	output1.onload = function () {
		URL.revokeObjectURL(output.src); // free memory
	};
};

// ------------------------ End Authentication --------------------------------
// ------------------------ Transaction---------------------------------------
//------------------------- Deposit -------------------------------------------
const btnDeposit = document.getElementById("btn-deposit");
if (btnDeposit) {
	btnDeposit.addEventListener("click", async (e) => {
		e.preventDefault();
		Swal.fire({
			title: "Nạp tiền vào tài khoản",
			icon: "info",
			text: "Bạn có muốn thực hiện giao dịch nạp tiền này không ?",
			confirmButtonColor: "#3085d6",
			showDenyButton: true,
			denyButtonText: `Hủy`,
			confirmButtonText: "Xác nhận",
		}).then((result) => {
			if (result.isConfirmed) {
				let cardNumber = document.getElementById("cardNumber").value;
				let cardExpirationDate =
					document.getElementById("cardExpirationDate").value;
				let cvv = document.getElementById("cvv").value;
				let price = document.getElementById("price").value;

				axios
					.post("/transactions/deposit", {
						cardNumber,
						cardExpirationDate,
						cvv,
						price,
					})
					.then((res) => {
						const dt = res.data;
						if (dt.status === "success") {
							document.getElementById("cardNumber").value = "";
							document.getElementById("cardExpirationDate").value = "";
							document.getElementById("cvv").value = "";
							document.getElementById("price").value = "";

							alert("success", "Thành công", dt.message);
						} else {
							alert("error", "Thất bại", dt.message);
						}
					})
					.catch((err) => {
						alert("error", "Lỗi", `${err.response}!!!`);
					});
			} else if (result.isDenied) {
			}
		});
	});
}

//------------------------- End Deposit ---------------------------------------

//------------------------- Withdraw ------------------------------------------

const priceWithdraw = document.getElementById("price");
if (priceWithdraw && document.getElementById("fee")) {
	priceWithdraw.addEventListener("keyup", (e) => {
		document.getElementById("fee").value = Math.floor(
			Number(e.target.value) * 0.05
		);
	});
}

const btnWithdraw = document.getElementById("btn-withdraw");
if (btnWithdraw) {
	btnWithdraw.addEventListener("click", async (e) => {
		e.preventDefault();
		Swal.fire({
			title: "Rút tiền về thẻ tín dụng",
			icon: "info",
			text: "Bạn có muốn thực hiện giao dịch rút tiền này không ?",
			confirmButtonColor: "#3085d6",
			showDenyButton: true,
			denyButtonText: `Hủy`,
			confirmButtonText: "Xác nhận",
		}).then((result) => {
			if (result.isConfirmed) {
				let cardNumber = document.getElementById("cardNumber").value;
				let cardExpirationDate =
					document.getElementById("cardExpirationDate").value;
				let cvv = document.getElementById("cvv").value;
				let price = document.getElementById("price").value;
				let message = document.getElementById("message").value;
				axios
					.post("/transactions/withdraw", {
						cardNumber,
						cardExpirationDate,
						cvv,
						price,
						message,
					})
					.then((res) => {
						const dt = res.data;
						if (dt.status === "success") {
							document.getElementById("cardNumber").value = "";
							document.getElementById("cardExpirationDate").value = "";
							document.getElementById("cvv").value = "";
							document.getElementById("price").value = "";
							document.getElementById("message").value = "";

							alert("success", "Thành công", dt.message);
						} else {
							alert("error", "Thất bại", dt.message);
						}
					})
					.catch((err) => {
						alert("error", "Lỗi", `${err.response}!!!`);
					});
			}
		});
	});
}
//------------------------- End Withdraw --------------------------------------

//------------------------- Transfer ------------------------------------------
// Get name
const receiverPhone = document.getElementById("receiverPhone");
if (receiverPhone) {
	receiverPhone.addEventListener("keyup", async (e) => {
		const name = document.getElementById("name");
		console.log(receiverPhone.value);
		axios.post("/accounts/phone", { phone: e.target.value }).then((res) => {
			if (res.data.status === "success") {
				name.value = res.data.data;
			} else {
				name.value = "";
			}
		});
	});
}

const btnTransfer = document.getElementById("btn-transfer");
if (btnTransfer) {
	btnTransfer.addEventListener("click", async (e) => {
		e.preventDefault();
		const receiverPhone = document.getElementById("receiverPhone").value;
		const name = document.getElementById("name").value;
		const price = document.getElementById("price").value;
		const isFeeForSender = document.getElementById("isFeeForSender").value;
		const message = document.getElementById("message").value;
		if (receiverPhone === "" || price <= 0 || message === "") {
			swal.fire({
				title: "Thông báo",
				text: "Vui lòng nhập đầy đủ thông tin",
				icon: "warning",
			});
		} else {
			Swal.fire({
				title: "Giao dịch chuyển tiền",
				icon: "info",
				showDenyButton: true,
				confirmButtonColor: "#3085d6",
				text: `Bạn có muốn thực hiện giao dịch rút tiền này không ?. Người nhận: ${name}, số điện thoại người nhận: ${receiverPhone}.`,
				denyButtonText: `Hủy`,
				confirmButtonText: "Xác nhận",
			}).then(async (result) => {
				if (result.isConfirmed) {
					const res = await axios.post("/transactions/send-otp", {
						receiverPhone,
						price,
						isFeeForSender,
						message,
					});
					if (res.data.status === "success") {
						Swal.fire({
							position: "center",
							icon: "success",
							title: res.data.message,
							showConfirmButton: false,
							timer: 3000,
						})
							.then(() => {
								localStorage.setItem("receiverPhone", receiverPhone);
								localStorage.setItem("name", name);
								localStorage.setItem("price", price);
								localStorage.setItem("isFeeForSender", isFeeForSender);
								localStorage.setItem("message", message);
								window.location.href =
									"/transactions/transfer/verify-otp";
							})
							.catch((err) => {
								alert("error", "Lỗi", `${err.response}!!!`);
							});
					} else {
						alert("error", "Thất bại", `${res.data.message}!!!`);
					}
				}
			});
		}
	});
}

const btnVerifyOTP = document.getElementById("btn-verify-otp");
if (btnVerifyOTP) {
	btnVerifyOTP.addEventListener("click", async (e) => {
		e.preventDefault();
		const otp = document.getElementById("otp").value;
		const receiverPhone = localStorage.getItem("receiverPhone");
		const name = localStorage.getItem("name");
		const price = localStorage.getItem("price");
		const isFeeForSender = localStorage.getItem("isFeeForSender");
		const message = localStorage.getItem("message");
		if (
			receiverPhone == null ||
			name == null ||
			price == null ||
			isFeeForSender == null ||
			message == null
		) {
			window.location.href = "/transactions/transfer";
		}
		if (otp === "") {
			swal.fire({
				title: "Thông báo",
				text: "Vui lòng nhập mã OTP",
				icon: "warning",
			});
		} else {
			const res = await axios.post("/transactions/transfer", {
				otp,
				receiverPhone,
				name,
				price,
				isFeeForSender,
				message,
			});
			if (res.data.status === "success") {
				await Swal.fire({
					position: "center",
					icon: "success",
					title: res.data.message,
					showConfirmButton: false,
					timer: 5000,
				});
				// clear localStorage
				localStorage.clear();
				window.location.href = "/transactions/history";
			} else {
				alert("error", "Thất bại", res.data.message);
			}
		}
	});
}

btnSendOTP = document.getElementById("btn-send-otp");
if (btnSendOTP) {
	btnSendOTP.addEventListener("click", async (e) => {
		const res = await axios.get("/transactions/get-otp");
		if (res.data.status === "success") {
			Swal.fire({
				position: "center",
				icon: "success",
				title: res.data.message,
				showConfirmButton: false,
				timer: 3000,
			});
		} else {
			alert("error", "Thất bại", res.data.message);
		}
	});
}

//------------------------- End Transfer --------------------------------------
//------------------------- End Transaction -----------------------------------

/* Data-table */
$(document).ready(function () {
	$(".data-table").each(function (_, table) {
		$(table).DataTable();
	});
});
