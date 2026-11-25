import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'classifications.g.dart';

/// Dated answers to questions about a named thing (UN region, feature function, office selection). Mzizi's code checks the scheme's scopes and one-answer rule.
@JsonSerializable(includeIfNull: false)
class IdentityClassifications {
  const IdentityClassifications({
    required this.classTerm,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.identityId,
    required this.schemeId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String classTerm;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final String identityId;
  final String schemeId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory IdentityClassifications.fromJson(Map<String, dynamic> json) => _$IdentityClassificationsFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityClassificationsToJson(this);
}
