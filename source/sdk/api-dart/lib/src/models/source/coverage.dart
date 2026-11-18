import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/products.dart';
import 'package:mzizi_api/src/models/source/sources.dart';

part 'coverage.g.dart';

/// What a source or product covers, for which place, years and kind of record, how completely, and when that was checked. It makes every 'none recorded' honest: the page says which sources were checked, and a gap is never read as zero.
@JsonSerializable(includeIfNull: false)
class SourceCoverage {
  const SourceCoverage({
    required this.checkedOn,
    required this.code,
    required this.countryId,
    required this.coverageSubjectId,
    required this.createdAt,
    this.deletedAt,
    this.expectedPublicationUrl,
    required this.id,
    required this.levelId,
    this.note,
    this.periodFrom,
    this.periodUntil,
    this.productId,
    this.publisherEntityId,
    this.scopeUnitFeatureId,
    this.sourceId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime checkedOn;
  final String code;
  final String countryId;
  final String coverageSubjectId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? expectedPublicationUrl;
  final String id;
  final String levelId;
  final String? note;
  final DateTime? periodFrom;
  final DateTime? periodUntil;
  final String? productId;
  final String? publisherEntityId;
  final String? scopeUnitFeatureId;
  final String? sourceId;
  final DateTime updatedAt;
  final int version;

  factory SourceCoverage.fromJson(Map<String, dynamic> json) => _$SourceCoverageFromJson(json);

  Map<String, dynamic> toJson() => _$SourceCoverageToJson(this);
}
