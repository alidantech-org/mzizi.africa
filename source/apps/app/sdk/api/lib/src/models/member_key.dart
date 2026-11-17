import 'package:json_annotation/json_annotation.dart';

part 'member_key.g.dart';

/// Member Key
@JsonSerializable(includeIfNull: false)
class MemberKey {
  const MemberKey({
    required this.code,
  });
  final String code;

  factory MemberKey.fromJson(Map<String, dynamic> json) => _$MemberKeyFromJson(json);

  Map<String, dynamic> toJson() => _$MemberKeyToJson(this);
}