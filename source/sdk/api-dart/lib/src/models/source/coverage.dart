import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/reference/levels.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/products.dart';
import 'package:mzizi_api/src/models/source/publishers.dart';
import 'package:mzizi_api/src/models/source/sources.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'coverage.g.dart';

/// Expected coverage, for acquisition planning.
@JsonSerializable(includeIfNull: false)
class SourceCoverage {
  const SourceCoverage({
    this.checkedOn,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.expectedUrl,
    this.featureId,
    this.fromYear,
    required this.id,
    this.levelId,
    this.note,
    this.noteLanguageId,
    this.productId,
    this.publisherId,
    this.sourceId,
    required this.subjectTerm,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final DateTime? checkedOn;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? expectedUrl;
  final String? featureId;
  final int? fromYear;
  final String id;
  final String? levelId;
  final String? note;
  final String? noteLanguageId;
  final String? productId;
  final String? publisherId;
  final String? sourceId;
  final String subjectTerm;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory SourceCoverage.fromJson(Map<String, dynamic> json) => _$SourceCoverageFromJson(json);

  Map<String, dynamic> toJson() => _$SourceCoverageToJson(this);
}
