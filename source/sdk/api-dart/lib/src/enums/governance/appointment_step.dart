import 'package:json_annotation/json_annotation.dart';

/// Appointment Step
enum GovernanceAppointmentStep {
  @JsonValue('appointment')
  appointment,
  @JsonValue('approval')
  approval,
  @JsonValue('nomination')
  nomination,
  @JsonValue('recommendation')
  recommendation,
  @JsonValue('swearing-in')
  swearingIn,
  @JsonValue('vetting')
  vetting,
}
