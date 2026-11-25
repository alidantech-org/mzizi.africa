import 'package:json_annotation/json_annotation.dart';

part 'election_key.g.dart';

/// Election Key
@JsonSerializable(includeIfNull: false)
class ElectionElectionKey {
  const ElectionElectionKey({required this.code});
  final String code;

  factory ElectionElectionKey.fromJson(Map<String, dynamic> json) => _$ElectionElectionKeyFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionElectionKeyToJson(this);
}
