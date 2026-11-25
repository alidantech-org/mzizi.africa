import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/governance/frequency.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'obligations.g.dart';

/// A duty to report that law sets; its explanation is a definition name.
@JsonSerializable(includeIfNull: false)
class GovernanceObligations {
  const GovernanceObligations({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.frequency,
    required this.holderId,
    required this.id,
    required this.kindTerm,
    this.provisionId,
    required this.recipientId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final GovernanceFrequency frequency;
  final String holderId;
  final String id;
  final String kindTerm;
  final String? provisionId;
  final String recipientId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceObligations.fromJson(Map<String, dynamic> json) => _$GovernanceObligationsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceObligationsToJson(this);
}
