import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'evidence.g.dart';

/// Durable evidence bundle whose exact supporting items are normalized citations.
@JsonSerializable(includeIfNull: false)
class SourceEvidence {
  const SourceEvidence({
    required this.assembledAt,
    required this.assembledBySnapshot,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.id,
    required this.kindId,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final DateTime assembledAt;
  final String assembledBySnapshot;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String id;
  final String kindId;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory SourceEvidence.fromJson(Map<String, dynamic> json) => _$SourceEvidenceFromJson(json);

  Map<String, dynamic> toJson() => _$SourceEvidenceToJson(this);
}
