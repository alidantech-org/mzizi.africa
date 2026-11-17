import 'package:json_annotation/json_annotation.dart';

part 'immutable.g.dart';

/// Base for append-only operational records: identity written once.
@JsonSerializable(includeIfNull: false)
class SharedImmutable {
  const SharedImmutable({required this.id});
  final String id;

  factory SharedImmutable.fromJson(Map<String, dynamic> json) => _$SharedImmutableFromJson(json);

  Map<String, dynamic> toJson() => _$SharedImmutableToJson(this);
}
