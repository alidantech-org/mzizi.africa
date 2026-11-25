import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/governance/appointment_step.dart';
import 'package:mzizi_api/src/models/governance/holders.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legislature/motions.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'appointments.g.dart';

/// One step that put a holder in office; appointments by Parliament or a board are recorded like those by a person.
@JsonSerializable(includeIfNull: false)
class GovernanceAppointments {
  const GovernanceAppointments({
    this.actorHolderId,
    required this.actorId,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.holderId,
    required this.id,
    this.motionId,
    this.onDate,
    required this.step,
    required this.updatedAt,
    required this.version,
  });
  final String? actorHolderId;
  final String actorId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String holderId;
  final String id;
  final String? motionId;
  final DateTime? onDate;
  final GovernanceAppointmentStep step;
  final DateTime updatedAt;
  final int version;

  factory GovernanceAppointments.fromJson(Map<String, dynamic> json) => _$GovernanceAppointmentsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceAppointmentsToJson(this);
}
