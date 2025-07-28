Feature: MarkdownsPeek Edge Cases

  As a developer
  I want to test edge cases and boundary conditions
  So that the library handles unusual situations gracefully

  Scenario: Empty configuration test
    Given I have an empty configuration object
    When I initialize MarkdownsPeek with empty config
    Then it should use default values
    And it should not throw an error

  Scenario: Null and undefined values test
    Given I have null and undefined values in config
    When I initialize MarkdownsPeek with null values
    Then it should handle null values gracefully
    And it should use fallback values

  Scenario: Very long text values test
    Given I have very long text values in configuration
    When I initialize MarkdownsPeek with long texts
    Then it should handle long texts without issues
    And the texts should be preserved correctly

  Scenario: Special characters in prefix test
    Given I have special characters in the prefix
    When I initialize MarkdownsPeek with special prefix
    Then it should handle special characters properly
    And the prefix should be valid for CSS classes 