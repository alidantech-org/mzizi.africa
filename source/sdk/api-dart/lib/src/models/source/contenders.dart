import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';
import 'package:mzizi_api/src/models/source/disputes.dart';

part 'contenders.g.dart';

/// One side of a dispute: a citation and the claim it supports.
@JsonSerializable(includeIfNull: false)
class SourceContenders {
  const SourceContenders({
    required this.citationId,
    required this.claim,
    required this.createdAt,
    this.deletedAt,
    required this.disputeId,
    required this.id,
    required this.isPreferred,
    this.position,
    required this.updatedAt,
    required this.version,
  });
  final String citationId;
  final String claim;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String disputeId;
  final String id;
  final bool isPreferred;
  final int? position;
  final DateTime updatedAt;
  final int version;

  factory SourceContenders.fromJson(Map<String, dynamic> json) => _$SourceContendersFromJson(json);

  Map<String, dynamic> toJson() => _$SourceContendersToJson(this);
}
