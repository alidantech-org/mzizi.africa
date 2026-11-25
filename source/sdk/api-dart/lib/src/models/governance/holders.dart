import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/contests.dart';
import 'package:mzizi_api/src/models/governance/offices.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'holders.g.dart';

/// A person in an office for a period. How they got there is `governance.appointments`.
@JsonSerializable(includeIfNull: false)
class GovernanceHolders {
  const GovernanceHolders({
    required this.code,
    this.contestId,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.fromYear,
    required this.id,
    required this.individualId,
    required this.methodTerm,
    required this.officeId,
    this.reasonTerm,
    this.startsOn,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? contestId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final int? fromYear;
  final String id;
  final String individualId;
  final String methodTerm;
  final String officeId;
  final String? reasonTerm;
  final DateTime? startsOn;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceHolders.fromJson(Map<String, dynamic> json) => _$GovernanceHoldersFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceHoldersToJson(this);
}
