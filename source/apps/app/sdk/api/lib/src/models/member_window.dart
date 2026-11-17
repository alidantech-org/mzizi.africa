import 'package:json_annotation/json_annotation.dart';
import 'page_window.dart';

part 'member_window.g.dart';

/// Member Window
@JsonSerializable(includeIfNull: false)
class MemberWindow {
  const MemberWindow({
    this.limit,
    this.offset,
    required this.schemeId,
  });
  final int? limit;
  final int? offset;
  final String schemeId;

  factory MemberWindow.fromJson(Map<String, dynamic> json) => _$MemberWindowFromJson(json);

  Map<String, dynamic> toJson() => _$MemberWindowToJson(this);
}