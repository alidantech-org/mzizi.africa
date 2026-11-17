import 'package:json_annotation/json_annotation.dart';

part 'found_member.g.dart';

/// Found Member
@JsonSerializable(includeIfNull: false)
class FoundMember {
  const FoundMember({
    required this.code,
    required this.id,
    required this.label,
    required this.scheme,
  });
  final String code;
  final String id;
  final String label;
  final String scheme;

  factory FoundMember.fromJson(Map<String, dynamic> json) => _$FoundMemberFromJson(json);

  Map<String, dynamic> toJson() => _$FoundMemberToJson(this);
}