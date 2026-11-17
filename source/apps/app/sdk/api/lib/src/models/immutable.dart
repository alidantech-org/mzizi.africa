import 'package:json_annotation/json_annotation.dart';

part 'immutable.g.dart';

/// Base for append-only operational records: identity written once.
@JsonSerializable(includeIfNull: false)
class Immutable {
  const Immutable({
    required this.id,
  });
  final String id;

  factory Immutable.fromJson(Map<String, dynamic> json) => _$ImmutableFromJson(json);

  Map<String, dynamic> toJson() => _$ImmutableToJson(this);
}