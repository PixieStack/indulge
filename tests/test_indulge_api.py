"""
INDULGE Dating Platform API Tests
Tests for: Auth, Verification, Profile, Prompts endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test user data
TEST_USER_EMAIL = f"test_{uuid.uuid4().hex[:8]}@example.com"
TEST_USER_PHONE = "+27821234567"
TEST_USER_PASSWORD = "TestPassword123!"
TEST_USER_FIRST_NAME = "TestUser"
TEST_USER_ROLE = "baby"


class TestHealthAndPrompts:
    """Test basic endpoints that don't require auth"""
    
    def test_prompts_endpoint_returns_list(self):
        """Test /api/prompts returns list of prompts"""
        response = requests.get(f"{BASE_URL}/api/prompts")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verify prompt structure
        first_prompt = data[0]
        assert "id" in first_prompt
        assert "category" in first_prompt
        assert "question" in first_prompt
        print(f"SUCCESS: /api/prompts returned {len(data)} prompts")
    
    def test_prompts_have_categories(self):
        """Test prompts have expected categories"""
        response = requests.get(f"{BASE_URL}/api/prompts")
        assert response.status_code == 200
        
        data = response.json()
        categories = set(p["category"] for p in data)
        
        # Should have at least these categories
        expected_categories = {"The Basics", "Lifestyle", "The Arrangement"}
        assert expected_categories.issubset(categories), f"Missing categories. Found: {categories}"
        print(f"SUCCESS: Found categories: {categories}")


class TestAuthSignup:
    """Test signup flow"""
    
    def test_signup_creates_user(self):
        """Test user signup creates account and returns token"""
        signup_data = {
            "email": TEST_USER_EMAIL,
            "phone": TEST_USER_PHONE,
            "password": TEST_USER_PASSWORD,
            "first_name": TEST_USER_FIRST_NAME,
            "role": TEST_USER_ROLE
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data)
        assert response.status_code == 200, f"Signup failed: {response.text}"
        
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == TEST_USER_EMAIL
        assert data["user"]["role"] == TEST_USER_ROLE
        assert data["user"]["first_name"] == TEST_USER_FIRST_NAME
        
        # Store token for other tests
        pytest.test_token = data["token"]
        pytest.test_user_id = data["user"]["id"]
        print(f"SUCCESS: User created with ID: {data['user']['id']}")
    
    def test_signup_duplicate_email_fails(self):
        """Test signup with duplicate email returns error"""
        signup_data = {
            "email": TEST_USER_EMAIL,
            "phone": "+27821234568",
            "password": TEST_USER_PASSWORD,
            "first_name": "Duplicate",
            "role": "daddy"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data)
        assert response.status_code == 400
        print("SUCCESS: Duplicate email signup correctly rejected")


class TestAuthLogin:
    """Test login flow"""
    
    def test_login_with_valid_credentials(self):
        """Test login with valid credentials returns token"""
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert response.status_code == 200, f"Login failed: {response.text}"
        
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == TEST_USER_EMAIL
        print("SUCCESS: Login successful")
    
    def test_login_with_invalid_credentials(self):
        """Test login with wrong password returns 401"""
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": "WrongPassword123!"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert response.status_code == 401
        print("SUCCESS: Invalid credentials correctly rejected")
    
    def test_login_with_nonexistent_user(self):
        """Test login with non-existent email returns 401"""
        login_data = {
            "email": "nonexistent@example.com",
            "password": TEST_USER_PASSWORD
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert response.status_code == 401
        print("SUCCESS: Non-existent user login correctly rejected")


class TestVerificationOTP:
    """Test OTP verification endpoints - CRITICAL: OTP should NOT be in response"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token before each test"""
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if response.status_code == 200:
            self.token = response.json()["token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            pytest.skip("Could not login for verification tests")
    
    def test_send_email_otp_no_code_in_response(self):
        """CRITICAL: Test /api/verification/send-otp does NOT return OTP code"""
        otp_data = {
            "type": "email",
            "value": TEST_USER_EMAIL
        }
        
        response = requests.post(
            f"{BASE_URL}/api/verification/send-otp",
            json=otp_data,
            headers=self.headers
        )
        assert response.status_code == 200, f"Send OTP failed: {response.text}"
        
        data = response.json()
        
        # CRITICAL SECURITY CHECK: OTP should NOT be in response
        assert "otp" not in data, "SECURITY ISSUE: OTP code found in response!"
        assert "code" not in data, "SECURITY ISSUE: Code found in response!"
        
        # Should have success message
        assert data.get("success") == True
        assert "message" in data
        print("SUCCESS: Email OTP sent, NO code in response (security verified)")
    
    def test_send_phone_otp_no_code_in_response(self):
        """CRITICAL: Test phone OTP does NOT return OTP code"""
        otp_data = {
            "type": "phone",
            "value": TEST_USER_PHONE
        }
        
        response = requests.post(
            f"{BASE_URL}/api/verification/send-otp",
            json=otp_data,
            headers=self.headers
        )
        assert response.status_code == 200, f"Send OTP failed: {response.text}"
        
        data = response.json()
        
        # CRITICAL SECURITY CHECK: OTP should NOT be in response
        assert "otp" not in data, "SECURITY ISSUE: OTP code found in response!"
        assert "code" not in data, "SECURITY ISSUE: Code found in response!"
        
        assert data.get("success") == True
        print("SUCCESS: Phone OTP sent, NO code in response (security verified)")
    
    def test_verify_otp_with_invalid_code(self):
        """Test OTP verification with invalid code fails"""
        verify_data = {
            "type": "email",
            "value": TEST_USER_EMAIL,
            "otp": "0000"  # Invalid OTP
        }
        
        response = requests.post(
            f"{BASE_URL}/api/verification/verify-otp",
            json=verify_data,
            headers=self.headers
        )
        # Should fail with 400 for invalid OTP
        assert response.status_code == 400
        print("SUCCESS: Invalid OTP correctly rejected")


class TestProfile:
    """Test profile endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token before each test"""
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if response.status_code == 200:
            self.token = response.json()["token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            pytest.skip("Could not login for profile tests")
    
    def test_get_my_profile(self):
        """Test getting current user profile"""
        response = requests.get(
            f"{BASE_URL}/api/profile/me",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["email"] == TEST_USER_EMAIL
        assert data["first_name"] == TEST_USER_FIRST_NAME
        assert "password_hash" not in data  # Should not expose password
        print("SUCCESS: Profile retrieved successfully")
    
    def test_update_profile_with_preferences(self):
        """Test updating profile with preferences (gender, age range)"""
        update_data = {
            "age": 25,
            "gender": "female",
            "location": "Cape Town, South Africa",
            "preferred_gender": ["male", "female"],
            "preferred_age_min": 21,
            "preferred_age_max": 45,
            "lifestyle_tags": ["Luxury Travel", "Fine Dining", "Fitness"]
        }
        
        response = requests.put(
            f"{BASE_URL}/api/profile/me",
            json=update_data,
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["age"] == 25
        assert data["gender"] == "female"
        assert data["preferred_gender"] == ["male", "female"]
        assert data["preferred_age_min"] == 21
        assert data["preferred_age_max"] == 45
        print("SUCCESS: Profile updated with preferences")
    
    def test_update_profile_with_photos(self):
        """Test updating profile with photos array"""
        update_data = {
            "photos": [
                "data:image/jpeg;base64,/9j/4AAQSkZJRg==",  # Mock base64 photo
                "data:image/jpeg;base64,/9j/4AAQSkZJRg=="
            ]
        }
        
        response = requests.put(
            f"{BASE_URL}/api/profile/me",
            json=update_data,
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["photos"]) == 2
        print("SUCCESS: Profile photos updated")
    
    def test_update_profile_with_prompts(self):
        """Test updating profile with personality prompts"""
        update_data = {
            "prompts": [
                {"question": "A fun fact about me...", "answer": "I love hiking", "category": "The Basics"},
                {"question": "I'm looking for...", "answer": "Genuine connection", "category": "The Basics"},
                {"question": "My travel bucket list includes...", "answer": "Maldives", "category": "Lifestyle"}
            ]
        }
        
        response = requests.put(
            f"{BASE_URL}/api/profile/me",
            json=update_data,
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["prompts"]) == 3
        print("SUCCESS: Profile prompts updated")
    
    def test_profile_without_auth_fails(self):
        """Test accessing profile without auth returns 401/403"""
        response = requests.get(f"{BASE_URL}/api/profile/me")
        assert response.status_code in [401, 403]
        print("SUCCESS: Unauthenticated profile access correctly rejected")


class TestDiscovery:
    """Test discovery/feed endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token before each test"""
        login_data = {
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if response.status_code == 200:
            self.token = response.json()["token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            pytest.skip("Could not login for discovery tests")
    
    def test_get_discovery_feed(self):
        """Test getting discovery feed"""
        response = requests.get(
            f"{BASE_URL}/api/discovery/feed",
            headers=self.headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert "profiles" in data
        assert isinstance(data["profiles"], list)
        print(f"SUCCESS: Discovery feed returned {len(data['profiles'])} profiles")


class TestAdminStats:
    """Test admin endpoints"""
    
    def test_get_admin_stats(self):
        """Test getting admin stats"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "total_users" in data
        assert "verified_users" in data
        assert "premium_users" in data
        assert "total_matches" in data
        print(f"SUCCESS: Admin stats - Total users: {data['total_users']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
