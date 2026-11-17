import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'member_window.g.dart';

/// Member Window
@JsonSerializable(includeIfNull: false)
class ReferenceMemberWindow {
  const ReferenceMemberWindow({this.limit, this.offset, required this.schemeId});
  final int? limit;
  final int? offset;
  final String schemeId;

  factory ReferenceMemberWindow.fromJson(Map<String, dynamic> json) => _$ReferenceMemberWindowFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceMemberWindowToJson(this);
}
