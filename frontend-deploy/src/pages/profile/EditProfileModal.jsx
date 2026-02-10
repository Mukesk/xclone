import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import baseUrl from "../../constant/baseUrl";
import toast from "react-hot-toast";
import axios from "axios";

const EditProfileModal = () => {
	const [formData, setFormData] = useState({
		firstname: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const updateData = useMutation({
		mutationFn: async (formData) => {
			const res = await axios.post(
				`${baseUrl}/api/user/updateProfile`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			document.getElementById("edit_profile_modal").close();
		},
		onError: (error) => {
			toast.error(error.response?.data?.err || "Update failed");
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		updateData.mutate(formData); // ✅ Corrected form data submission
	};

	return (
		<>
			<button
				className="btn btn-outline rounded-full btn-sm"
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id="edit_profile_modal" className="modal">
				<div className="modal-box border rounded-md border-gray-700 shadow-md">
					<h3 className="font-bold text-lg my-3">Update Profile</h3>
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div className="flex flex-wrap gap-2">
							<input
								type="text"
								placeholder="First Name"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.firstname}
								name="firstname"
								onChange={handleInputChange}
							/>
							<input
								type="text"
								placeholder="Username"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.username}
								name="username"
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							<input
								type="email"
								placeholder="Email"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.email}
								name="email"
								onChange={handleInputChange}
							/>
							<textarea
								placeholder="Bio"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.bio}
								name="bio"
								onChange={handleInputChange}
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							<input
								type="password"
								placeholder="Current Password"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.currentPassword}
								name="currentPassword"
								onChange={handleInputChange}
							/>
							<input
								type="password"
								placeholder="New Password"
								className="flex-1 input border border-gray-700 rounded p-2 input-md"
								value={formData.newPassword}
								name="newPassword"
								onChange={handleInputChange}
							/>
						</div>
						<input
							type="text"
							placeholder="Link"
							className="flex-1 input border border-gray-700 rounded p-2 input-md"
							value={formData.link}
							name="link"
							onChange={handleInputChange}
						/>
						<button
							type="submit"
							className="btn btn-primary rounded-full btn-sm text-white"
							disabled={updateData.isLoading}
						>
							{updateData.isLoading ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button className="outline-none">Close</button>
				</form>
			</dialog>
		</>
	);
};

export default EditProfileModal;
