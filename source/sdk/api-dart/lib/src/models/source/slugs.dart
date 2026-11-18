import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_subject_entity.dart';

part 'slugs.g.dart';

/// One public address segment for one subject row. Identifies a thing by a clean name under its parent; closed rows keep history so a renamed or re-parented thing redirects instead of breaking. Carries no title: titles come from the name tables.
@JsonSerializable(includeIfNull: false)
class SourceSlugs {
  const SourceSlugs({
    this.canonicalSlugId,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    this.languageId,
    required this.namespaceId,
    this.parentSlugId,
    required this.slug,
    required this.subjectId,
    required this.subjectTable,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String? canonicalSlugId;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String? languageId;
  final String namespaceId;
  final String? parentSlugId;
  final String slug;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory SourceSlugs.fromJson(Map<String, dynamic> json) => _$SourceSlugsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceSlugsToJson(this);
}
