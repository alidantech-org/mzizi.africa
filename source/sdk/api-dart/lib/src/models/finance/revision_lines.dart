import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'revision_lines.g.dart';

/// Revision Lines
@JsonSerializable(includeIfNull: false)
class FinanceRevisionLines {
  const FinanceRevisionLines({this.limit, this.offset, required this.revisionId});
  final int? limit;
  final int? offset;
  final String revisionId;

  factory FinanceRevisionLines.fromJson(Map<String, dynamic> json) => _$FinanceRevisionLinesFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceRevisionLinesToJson(this);
}
