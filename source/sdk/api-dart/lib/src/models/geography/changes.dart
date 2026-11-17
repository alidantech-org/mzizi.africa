import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'changes.g.dart';

/// An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities.
@JsonSerializable(includeIfNull: false)
class GeographyChanges {
  const GeographyChanges({
    required this.changeKindId,
    required this.createdAt,
    this.deletedAt,
    this.effectiveOn,
    this.explanation,
    required this.id,
    this.predecessorFeatureId,
    this.successorFeatureId,
    required this.transformationId,
    required this.updatedAt,
    required this.version,
  });
  final String changeKindId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? effectiveOn;
  final String? explanation;
  final String id;
  final String? predecessorFeatureId;
  final String? successorFeatureId;
  final String transformationId;
  final DateTime updatedAt;
  final int version;

  factory GeographyChanges.fromJson(Map<String, dynamic> json) => _$GeographyChangesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyChangesToJson(this);
}
