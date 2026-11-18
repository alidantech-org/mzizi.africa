import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/period_entity.dart';
import 'package:mzizi_api/src/models/source/slugs.dart';

part 'links.g.dart';

/// A dated relation between two slugs that name the same thing or the same area: translations, aliases, a constituency and a sub-county covering the same land. Must not form cycles.
@JsonSerializable(includeIfNull: false)
class SourceLinks {
  const SourceLinks({
    required this.createdAt,
    this.deletedAt,
    required this.fromSlugId,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.relationKindId,
    required this.toSlugId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String fromSlugId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String relationKindId;
  final String toSlugId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory SourceLinks.fromJson(Map<String, dynamic> json) => _$SourceLinksFromJson(json);

  Map<String, dynamic> toJson() => _$SourceLinksToJson(this);
}
