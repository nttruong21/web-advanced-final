// ------------------------ ADMIN --------------------------------

// ------------------------ CLIENT -------------------------------

// ------------------------ Authentication -------------------------------
// login
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
		console.log(res.data);

		if (res.data.status === "success") {
			alert("Login success");
			window.setTimeout(() => {
				location.assign("/");
			}, 1500);
		}
	} catch (err) {
		console.log(("error", err.response.data.message));
	}
};

document.querySelector(".form-login").addEventListener("submit", (e) => {
	e.preventDefault();
	const username = document.querySelector("#username").value;
	const password = document.querySelector("#password").value;
	login(username, password);
});

// ------------------------ End Authentication --------------------------------
/* Data-table */
$(document).ready(function () {
	$(".data-table").each(function (_, table) {
		$(table).DataTable();
	});
});
