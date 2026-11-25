import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/history/link_kind.dart';
import 'package:mzizi_api/src/models/history/occurrences.dart';
import 'package:mzizi_api/src/models/shared/association.dart';

part 'links.g.dart';

/// How historical occurrences relate to one another.
@JsonSerializable(includeIfNull: false)
class HistoryLinks {
  const HistoryLinks({required this.createdAt, this.deletedAt, required this.fromId, required this.id, required this.kind, required this.toId});
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String fromId;
  final String id;
  final HistoryLinkKind kind;
  final String toId;

  factory HistoryLinks.fromJson(Map<String, dynamic> json) => _$HistoryLinksFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryLinksToJson(this);
}
