import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'pattern.g.dart';

/// A reviewed rule for generating expected records (institutions, positions, offices, site candidates) before real ones are found. It holds no versions, bindings or dependencies; see DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119.
@JsonSerializable(includeIfNull: false)
class ReferencePattern {
  const ReferencePattern({
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.id,
    this.kindId,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String id;
  final String? kindId;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory ReferencePattern.fromJson(Map<String, dynamic> json) => _$ReferencePatternFromJson(json);

  Map<String, dynamic> toJson() => _$ReferencePatternToJson(this);
}
