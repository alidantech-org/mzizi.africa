import 'package:json_annotation/json_annotation.dart';

part 'member_key.g.dart';

/// Member Key
@JsonSerializable(includeIfNull: false)
class ReferenceMemberKey {
  const ReferenceMemberKey({required this.code});
  final String code;

  factory ReferenceMemberKey.fromJson(Map<String, dynamic> json) => _$ReferenceMemberKeyFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceMemberKeyToJson(this);
}
