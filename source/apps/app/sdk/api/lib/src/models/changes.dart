import 'package:json_annotation/json_annotation.dart';
import 'entity.dart';
import 'features.dart';
import 'value.dart';

part 'changes.g.dart';

/// An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities.
@JsonSerializable(includeIfNull: false)
class Changes {
  const Changes({
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

  factory Changes.fromJson(Map<String, dynamic> json) => _$ChangesFromJson(json);

  Map<String, dynamic> toJson() => _$ChangesToJson(this);
}