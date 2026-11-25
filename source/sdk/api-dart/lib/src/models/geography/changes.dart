import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/history/occurrences.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'changes.g.dart';

/// One edge of a boundary change: splits, merges, creation or dissolution, without overwriting the places.
@JsonSerializable(includeIfNull: false)
class GeographyChanges {
  const GeographyChanges({
    required this.createdAt,
    this.deletedAt,
    this.effectiveOn,
    required this.id,
    required this.kindTerm,
    this.note,
    this.noteLanguageId,
    this.occurrenceId,
    this.predecessorFeatureId,
    this.successorFeatureId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? effectiveOn;
  final String id;
  final String kindTerm;
  final String? note;
  final String? noteLanguageId;
  final String? occurrenceId;
  final String? predecessorFeatureId;
  final String? successorFeatureId;
  final DateTime updatedAt;
  final int version;

  factory GeographyChanges.fromJson(Map<String, dynamic> json) => _$GeographyChangesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyChangesToJson(this);
}
