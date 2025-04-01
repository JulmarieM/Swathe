/**
 * Form validation and submission handler for Swathe waitlist
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("waitlistForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const formFeedback = document.getElementById("formFeedback");
  const submitButton = document.getElementById("submitButton");

  // Local storage key
  const STORAGE_KEY = "swathe_waitlist_submissions";

  /**
   * Validate name field
   * @returns {boolean} Whether the name is valid
   */
  function validateName() {
    const name = nameInput.value.trim();
    let isValid = true;

    if (name === "") {
      nameError.textContent = "Name is required";
      nameInput.parentElement.classList.add("error");
      isValid = false;
    } else if (name.length < 2) {
      nameError.textContent = "Name must be at least 2 characters";
      nameInput.parentElement.classList.add("error");
      isValid = false;
    } else {
      nameError.textContent = "";
      nameInput.parentElement.classList.remove("error");
    }

    return isValid;
  }

  /**
   * Validate email field
   * @returns {boolean} Whether the email is valid
   */
  function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (email === "") {
      emailError.textContent = "Email is required";
      emailInput.parentElement.classList.add("error");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      emailError.textContent = "Please enter a valid email address";
      emailInput.parentElement.classList.add("error");
      isValid = false;
    } else {
      emailError.textContent = "";
      emailInput.parentElement.classList.remove("error");
    }

    return isValid;
  }

  /**
   * Validate the entire form
   * @returns {boolean} Whether the form is valid
   */
  function validateForm() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();

    return isNameValid && isEmailValid;
  }

  /**
   * Save form submission to local storage
   * @param {Object} formData - The form data to save
   */
  function saveToLocalStorage(formData) {
    // Get existing submissions or initialize empty array
    const existingSubmissions = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );

    // Add new submission with timestamp
    existingSubmissions.push({
      ...formData,
      timestamp: new Date().toISOString(),
    });

    // Save back to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingSubmissions));
  }

  /**
   * Mock API submission - in a real app, this would call an actual API
   * @param {Object} formData - The form data to submit
   * @returns {Promise} A promise that resolves after a simulated API call
   */
  function mockApiSubmission(formData) {
    return new Promise((resolve, reject) => {
      // Simulate API call with 50% success rate for demonstration
      setTimeout(() => {
        const isSuccess = Math.random() > 0.5;
        if (isSuccess) {
          resolve({
            success: true,
            message: "Thank you for joining our waitlist!",
          });
        } else {
          reject({
            success: false,
            message: "Network error. Please try again later.",
          });
        }
      }, 1000); // Simulate network delay
    });
  }

  /**
   * Handle form submission
   * @param {Event} e - The form submission event
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Clear previous feedback
    formFeedback.textContent = "";
    formFeedback.className = "form-feedback";

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Disable submit button during submission
    submitButton.disabled = true;

    // Collect form data
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
    };

    try {
      // In a real application, you would call an actual API endpoint
      // For this example, we'll use a mock API and save to local storage
      const response = await mockApiSubmission(formData);

      // Save to local storage
      saveToLocalStorage(formData);

      // Show success message
      formFeedback.textContent = response.message;
      formFeedback.classList.add("success");

      // Reset form
      form.reset();
    } catch (error) {
      // Show error message
      formFeedback.textContent =
        error.message || "An error occurred. Please try again.";
      formFeedback.classList.add("error");
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;

      // Scroll to top of form to show feedback
      formFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  // Add event listeners for real-time validation
  nameInput.addEventListener("blur", validateName);
  emailInput.addEventListener("blur", validateEmail);

  // Add form submission handler
  form.addEventListener("submit", handleSubmit);
});
