Feature: MarkdownsPeek Utility Methods

  As a developer
  I want to test utility methods of the MarkdownsPeek library
  So that I can ensure they work correctly

  Scenario: Test formatFileName method
    Given I have a MarkdownsPeek instance
    When I call formatFileName with different inputs
    Then the filename should be formatted correctly
    And special characters should be handled properly

  Scenario: Test calculateReadingTime method
    Given I have a MarkdownsPeek instance
    When I call calculateReadingTime with content
    Then the reading time should be calculated
    And it should return a reasonable estimate

  Scenario: Test formatFileSize method
    Given I have a MarkdownsPeek instance
    When I call formatFileSize with different sizes
    Then the file size should be formatted correctly
    And it should use appropriate units 