import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/vocabulary/term_status.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/units.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/schemes.dart';

part 'terms.g.dart';

/// A member of one scheme: a code, its place in the scheme, display hints and optional numeric band. No display text: words are `vocabulary.labels`.
@JsonSerializable(includeIfNull: false)
class VocabularyTerms {
  const VocabularyTerms({
    required this.code,
    this.colorToken,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.iconCode,
    required this.id,
    this.lower,
    this.lowerInclusive,
    this.parentId,
    this.position,
    required this.schemeId,
    required this.status,
    this.supersedesId,
    this.unitId,
    required this.updatedAt,
    this.upper,
    this.upperInclusive,
    required this.version,
  });
  final String code;
  final String? colorToken;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? iconCode;
  final String id;
  final double? lower;
  final bool? lowerInclusive;
  final String? parentId;
  final int? position;
  final String schemeId;
  final VocabularyTermStatus status;
  final String? supersedesId;
  final String? unitId;
  final DateTime updatedAt;
  final double? upper;
  final bool? upperInclusive;
  final int version;

  factory VocabularyTerms.fromJson(Map<String, dynamic> json) => _$VocabularyTermsFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularyTermsToJson(this);
}
