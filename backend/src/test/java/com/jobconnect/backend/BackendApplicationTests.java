package com.jobconnect.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobconnect.backend.controller.AuthController;
import com.jobconnect.backend.controller.ApplicationController;
import com.jobconnect.backend.controller.CandidateController;
import com.jobconnect.backend.dto.*;
import com.jobconnect.backend.enums.UserRole;
import com.jobconnect.backend.service.interf.ApplicationService;
import com.jobconnect.backend.service.interf.AuthService;
import com.jobconnect.backend.service.interf.CandidateService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest({ AuthController.class, ApplicationController.class, CandidateController.class })
public class BackendApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private AuthService authService;

	@MockBean
	private ApplicationService applicationService;

	@MockBean
	private CandidateService candidateService;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void testRegister() throws Exception {
		RegisterRequest request = new RegisterRequest();
		request.setUsername("abishek");
		request.setPassword("password");
		request.setEmail("abishek@example.com");
		request.setPhone("9876543210");
		request.setRole(UserRole.CANDIDATE); // ✅ USE VALID ENUM VALUE
		request.setCompanyName("Test Company");
		request.setCompanyWebsite("https://company.com");

		AuthResponse response = AuthResponse.builder()
				.id(1L)
				.username("abishek")
				.token("mock-token")
				.role(UserRole.CANDIDATE)
				.build();

		Mockito.when(authService.register(any())).thenReturn(response);

		mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").value("mock-token"));
	}

	@Test
	void testLogin() throws Exception {
		LoginRequest loginRequest = new LoginRequest();
		loginRequest.setUsername("abishek");
		loginRequest.setPassword("password");

		AuthResponse response = AuthResponse.builder()
				.id(1L)
				.username("abishek")
				.token("login-token")
				.role(UserRole.CANDIDATE)
				.build();

		Mockito.when(authService.login(any())).thenReturn(response);

		mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").value("login-token"));
	}

	@Test
	void testUpdateApplicationStatus() throws Exception {
		mockMvc.perform(patch("/api/applications/1/status")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\": \"ACCEPTED\"}"))
				.andExpect(status().isOk());

		verify(applicationService).updateApplicationStatus(1L, "ACCEPTED");
	}

	@Test
	void testSearchJobs() throws Exception {
		JobPostDto job = JobPostDto.builder()
				.id(1L)
				.title("Java Developer")
				.location("Chennai")
				.build();

		Mockito.when(candidateService.searchJobs("Java Developer", "Chennai"))
				.thenReturn(List.of(job));

		mockMvc.perform(get("/api/candidate/jobs/search")
				.param("title", "Java Developer")
				.param("location", "Chennai"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].title").value("Java Developer"));
	}

	@Test
	void testApplyToJob() throws Exception {
		ApplicationRequestDto dto = new ApplicationRequestDto(1L);

		ApplicationResponseDto response = ApplicationResponseDto.builder()
				.applicationId(100L)
				.jobId(1L)
				.jobTitle("Java Developer")
				.jobLocation("Remote")
				.applicationStatus("PENDING")
				.candidateName("Abishek")
				.resumeUrl("https://example.com/resume.pdf")
				.build();

		Mockito.when(candidateService.applyToJob(any())).thenReturn(response);

		mockMvc.perform(post("/api/candidate/apply")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(dto)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.applicationId").value(100));
	}
}
