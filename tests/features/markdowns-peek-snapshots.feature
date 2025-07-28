Feature: MarkdownsPeek Snapshots

  As a developer
  I want to ensure the HTML structure remains consistent
  So that the UI doesn't break unexpectedly

  Scenario: Default HTML structure snapshot
    Given I have a MarkdownsPeek instance with default settings
    When I initialize the component
    Then the HTML structure should match the snapshot
    And the CSS classes should be consistent

  Scenario: Custom configuration HTML structure snapshot
    Given I have a MarkdownsPeek instance with custom settings
    When I initialize the component with custom config
    Then the HTML structure should match the custom snapshot
    And the custom CSS classes should be applied

  Scenario: Mobile menu HTML structure snapshot
    Given I have a MarkdownsPeek instance
    When the mobile menu is rendered
    Then the mobile menu HTML should match the snapshot
    And the mobile-specific classes should be present 