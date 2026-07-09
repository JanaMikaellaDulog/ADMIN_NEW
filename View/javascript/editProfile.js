/**
 * editProfile.js
 * Handles the Edit Profile modal: avatar preview/upload, username change,
 * and a secure password change gated behind a confirmation step.
 */

// Snapshot of the server-rendered "saved" state, captured once when the page
// loads. Every time the modal is (re)opened we restore this snapshot, so any
// unsaved edits (photo pick, username tweak, password fields) are discarded.
const editProfileInitialState = (function () {
    const img = document.getElementById('profileAvatarPreview');
    const usernameInput = document.getElementById('profileUsername');
    return {
        avatarSrc: img ? img.getAttribute('src') || '' : '',
        hadAvatar: !!(img && img.getAttribute('src')),
        username: usernameInput ? usernameInput.value : ''
    };
})();

function openEditProfileModal() {
    // Close the topbar dropdown first
    const dropdown = document.getElementById('topbarDropdown');
    if (dropdown) dropdown.classList.remove('open');

    // Restore username back to the last-saved value
    const usernameInput = document.getElementById('profileUsername');
    if (usernameInput) usernameInput.value = editProfileInitialState.username;

    // Clear any unsaved photo selection and restore the last-saved avatar
    const photoInput = document.getElementById('profilePhotoInput');
    if (photoInput) photoInput.value = '';

    const img = document.getElementById('profileAvatarPreview');
    const fallback = document.getElementById('profileAvatarDefault');
    if (img && fallback) {
        if (editProfileInitialState.hadAvatar) {
            img.src = editProfileInitialState.avatarSrc;
            img.style.display = 'block';
            fallback.style.display = 'none';
        } else {
            img.src = '';
            img.style.display = 'none';
            fallback.style.display = 'block';
        }
    }

    // Always start with password fields empty
    const curr = document.getElementById('profileCurrentPassword');
    const next = document.getElementById('profileNewPassword');
    const confirmField = document.getElementById('profileConfirmPassword');
    if (curr) curr.value = '';
    if (next) next.value = '';
    if (confirmField) confirmField.value = '';

    // Reset all password fields back to hidden (in case they were left revealed last time)
    ['profileCurrentPassword', 'profileNewPassword', 'profileConfirmPassword'].forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;
        input.type = 'password';
        const btn = input.parentElement ? input.parentElement.querySelector('.password-toggle-btn') : null;
        if (btn) {
            btn.querySelector('.icon-eye').style.display = 'block';
            btn.querySelector('.icon-eye-off').style.display = 'none';
            btn.setAttribute('aria-label', 'Show password');
        }
    });

    const modal = document.getElementById('editProfileModal');
    if (modal) modal.style.display = 'flex';
}

// Toggles a password input between hidden (dots) and visible (plain text),
// swapping the eye / eye-off icon on the trigger button to match.
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';

    if (btn) {
        const eyeIcon = btn.querySelector('.icon-eye');
        const eyeOffIcon = btn.querySelector('.icon-eye-off');
        if (eyeIcon) eyeIcon.style.display = showing ? 'block' : 'none';
        if (eyeOffIcon) eyeOffIcon.style.display = showing ? 'none' : 'block';
        btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    }
}

function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.style.display = 'none';
}

function previewProfilePhoto(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (PNG, JPG, or GIF).');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.getElementById('profileAvatarPreview');
        const fallback = document.getElementById('profileAvatarDefault');
        if (img) {
            img.src = e.target.result;
            img.style.display = 'block';
        }
        if (fallback) fallback.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// Step 1: validate the form, then ask for confirmation before actually saving
function requestSaveProfile() {
    const username = document.getElementById('profileUsername').value.trim();
    const currentPassword = document.getElementById('profileCurrentPassword').value;
    const newPassword = document.getElementById('profileNewPassword').value;
    const confirmPassword = document.getElementById('profileConfirmPassword').value;

    if (!username) {
        alert('Username cannot be empty.');
        return;
    }

    const wantsPasswordChange = newPassword.length > 0 || confirmPassword.length > 0;

    if (wantsPasswordChange) {
        if (!currentPassword) {
            alert('Please enter your current password to set a new one.');
            return;
        }
        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('New password and confirmation do not match.');
            return;
        }
    }

    const confirmModal = document.getElementById('confirmProfileModal');
    if (confirmModal) confirmModal.style.display = 'flex';
}

function closeConfirmProfileModal() {
    const confirmModal = document.getElementById('confirmProfileModal');
    if (confirmModal) confirmModal.style.display = 'none';
}

// Step 2: actually submit once the user confirms
function submitProfileChanges() {
    const saveBtn = document.getElementById('confirmProfileSaveBtn');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
    }

    const formData = new FormData();
    formData.append('action', 'update_profile');
    formData.append('admin_name', document.getElementById('profileUsername').value.trim());
    formData.append('current_password', document.getElementById('profileCurrentPassword').value);
    formData.append('new_password', document.getElementById('profileNewPassword').value);
    formData.append('confirm_password', document.getElementById('profileConfirmPassword').value);

    const photoInput = document.getElementById('profilePhotoInput');
    if (photoInput && photoInput.files && photoInput.files[0]) {
        formData.append('profile_photo', photoInput.files[0]);
    }

    fetch('admin_api.php', {
        method: 'POST',
        body: formData
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert('Profile updated successfully!');
                location.reload();
            } else {
                alert('Error: ' + (data.message || 'Could not save changes.'));
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.textContent = 'SAVE CHANGES';
                }
            }
        })
        .catch((err) => {
            console.error('Profile update error:', err);
            alert('A system error occurred. Please try again.');
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = 'SAVE CHANGES';
            }
        })
        .finally(() => {
            closeConfirmProfileModal();
        });
}

// Close modals when clicking the dark overlay outside the content box
document.addEventListener('click', function (event) {
    const editModal = document.getElementById('editProfileModal');
    const confirmModal = document.getElementById('confirmProfileModal');

    if (editModal && event.target === editModal) {
        closeEditProfileModal();
    }
    if (confirmModal && event.target === confirmModal) {
        closeConfirmProfileModal();
    }
});