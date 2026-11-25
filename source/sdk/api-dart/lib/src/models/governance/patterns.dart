import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'patterns.g.dart';

/// A reviewed rule for generating expected records (institutions, positions, offices, sites) before real ones are found.
@JsonSerializable(includeIfNull: false)
class GovernancePatterns {
  const GovernancePatterns({
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.kindTerm,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? kindTerm;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory GovernancePatterns.fromJson(Map<String, dynamic> json) => _$GovernancePatternsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernancePatternsToJson(this);
}
