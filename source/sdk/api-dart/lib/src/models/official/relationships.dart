import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'relationships.g.dart';

/// A kinship, business or political tie between public figures and organisations, always with a source link.
@JsonSerializable(includeIfNull: false)
class OfficialRelationships {
  const OfficialRelationships({
    required this.basisTerm,
    this.confidence,
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    required this.fromId,
    this.fromYear,
    required this.id,
    required this.kindTerm,
    this.sharePercentage,
    this.startsOn,
    required this.statusTerm,
    required this.toId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String basisTerm;
  final double? confidence;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final String fromId;
  final int? fromYear;
  final String id;
  final String kindTerm;
  final double? sharePercentage;
  final DateTime? startsOn;
  final String statusTerm;
  final String toId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory OfficialRelationships.fromJson(Map<String, dynamic> json) => _$OfficialRelationshipsFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialRelationshipsToJson(this);
}
