import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'relationships.g.dart';

/// A structural link from law: a ministry part of the executive, a committee part of its house.
@JsonSerializable(includeIfNull: false)
class GovernanceRelationships {
  const GovernanceRelationships({
    required this.createdAt,
    this.deletedAt,
    required this.fromId,
    this.fromYear,
    required this.id,
    required this.kindTerm,
    this.provisionId,
    required this.toId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String fromId;
  final int? fromYear;
  final String id;
  final String kindTerm;
  final String? provisionId;
  final String toId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GovernanceRelationships.fromJson(Map<String, dynamic> json) => _$GovernanceRelationshipsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceRelationshipsToJson(this);
}
