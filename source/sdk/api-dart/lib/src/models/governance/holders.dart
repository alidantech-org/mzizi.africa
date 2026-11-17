import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_validity_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'holders.g.dart';

/// One person's continuous tenure in one office, with appointment kind and effective dates.
@JsonSerializable(includeIfNull: false)
class GovernanceHolders {
  const GovernanceHolders({
    this.appointedByEntityId,
    required this.appointmentKindId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.individualId,
    required this.officeId,
    this.sourceCitationId,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final String? appointedByEntityId;
  final String appointmentKindId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String individualId;
  final String officeId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory GovernanceHolders.fromJson(Map<String, dynamic> json) => _$GovernanceHoldersFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceHoldersToJson(this);
}
