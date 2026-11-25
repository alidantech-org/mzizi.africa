import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/governance/appointment_step.dart';

part 'office_detail_holders_steps.g.dart';

/// Office Detail Holders Steps
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeDetailHoldersSteps {
  const GovernanceOfficeDetailHoldersSteps({
    required this.actorCode,
    this.actorHolderId,
    required this.actorId,
    this.motionId,
    this.onDate,
    required this.step,
  });
  final String actorCode;
  final String? actorHolderId;
  final String actorId;
  final String? motionId;
  final DateTime? onDate;
  final GovernanceAppointmentStep step;

  factory GovernanceOfficeDetailHoldersSteps.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeDetailHoldersStepsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeDetailHoldersStepsToJson(this);
}
