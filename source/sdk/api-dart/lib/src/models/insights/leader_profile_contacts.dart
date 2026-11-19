import 'package:json_annotation/json_annotation.dart';

part 'leader_profile_contacts.g.dart';

/// Leader Profile Contacts
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfileContacts {
  const InsightsLeaderProfileContacts({required this.kind, required this.scope, required this.value, required this.visibility});
  final String kind;
  final String scope;
  final String value;
  final String visibility;

  factory InsightsLeaderProfileContacts.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileContactsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileContactsToJson(this);
}
