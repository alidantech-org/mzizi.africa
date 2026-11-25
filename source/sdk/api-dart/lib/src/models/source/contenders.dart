import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/disputes.dart';

part 'contenders.g.dart';

/// One side of a dispute.
@JsonSerializable(includeIfNull: false)
class SourceContenders {
  const SourceContenders({
    required this.claim,
    required this.createdAt,
    this.deletedAt,
    required this.disputeId,
    required this.evidenceId,
    required this.id,
    required this.isPreferred,
    required this.languageId,
    required this.updatedAt,
    required this.version,
  });
  final String claim;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String disputeId;
  final String evidenceId;
  final String id;
  final bool isPreferred;
  final String languageId;
  final DateTime updatedAt;
  final int version;

  factory SourceContenders.fromJson(Map<String, dynamic> json) => _$SourceContendersFromJson(json);

  Map<String, dynamic> toJson() => _$SourceContendersToJson(this);
}
